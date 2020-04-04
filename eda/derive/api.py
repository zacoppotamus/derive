# pylint: disable=no-value-for-parameter
from flask import Flask, jsonify
from flask_restful import reqparse, Api, Resource
from flask_restful.utils import cors
from utils.encoder import NumpyEncoder


import faiss
import inspect
import json
import numpy as np
import os
import pickle
import logging

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
PKL_FILE = "{dir}/neighborhoods/urban/urban.pkl".format(dir=current_dir)

app = Flask(__name__)
app.config["BUNDLE_ERRORS"] = True

api = Api(app)

# Parse arguments
parser = reqparse.RequestParser()
parser.add_argument("id", type=int, required=True, help="Sample ID cannot be blank")
parser.add_argument("results", type=int)

soundscape = pickle.load(open(PKL_FILE, "rb"))

vectors = np.array([s["coordinates"] for s in soundscape.metadata]).astype("float32")
ids = np.array([s["id"] for s in soundscape.metadata]).astype("int")

# pylint: disable=unsubscriptable-object
index = faiss.IndexFlatL2(vectors.shape[1])

index = faiss.IndexIDMap2(index)
index.add_with_ids(vectors, ids)

logging.info("Server ready")


class Similarity(Resource):
    @cors.crossdomain(origin="*")
    def get(self):
        args = parser.parse_args()
        sample_id = args["id"]
        num_results = args["results"] or 20

        D, I = index.search(
            np.array([index.reconstruct(int(sample_id))]), k=num_results
        )

        out = list(item for item in soundscape.metadata if item["id"] in I.flatten())
        return json.dumps(out, cls=NumpyEncoder, indent=4)


# Setup the API resource routing here
# Route the URL to the resource
api.add_resource(Similarity, "/similar")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8888)
