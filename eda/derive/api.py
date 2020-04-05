# pylint: disable=no-value-for-parameter
from flask import Flask, jsonify, send_from_directory
from flask_restful import reqparse, Api, Resource
from flask_restful.utils import cors
from utils.encoder import NumpyEncoder
from utils.files import find_in_subdirs


import faiss
import inspect
import json
import numpy as np
import os
import pickle
import logging

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
PKL_FILE = "{dir}/neighborhoods/urban/urban.pkl".format(dir=current_dir)
AUDIO_DIR = "{dir}/audio".format(dir=current_dir)

app = Flask(__name__)
app.config["BUNDLE_ERRORS"] = True
app.config["DEBUG"] = True

api = Api(app)

# Parse arguments
parser = reqparse.RequestParser()
# parser.add_argument("id", type=int, required=True, help="Sample ID cannot be blank")
parser.add_argument("results", type=int)
parser.add_argument("x", type=float)
parser.add_argument("y", type=float)
parser.add_argument("z", type=float)

soundscape = pickle.load(open(PKL_FILE, "rb"))

vectors = np.array([s["coordinates"] for s in soundscape.metadata]).astype("float32")
ids = np.array([s["id"] for s in soundscape.metadata]).astype("int")

# pylint: disable=unsubscriptable-object
index = faiss.IndexFlatL2(vectors.shape[1])

index = faiss.IndexIDMap2(index)
index.add_with_ids(vectors, ids)

# Get coordinates
coordinates = [
    {
        "id": id,
        "coordinates": v.tolist(),
        "tag": m["tags"],
        # "description": m["description"],
    }
    for v, id, m in zip(vectors, ids, soundscape.metadata)
]

logging.info("Server ready")


class Audio(Resource):
    @cors.crossdomain(origin="*")
    def get(self, sample_id):
        # args = parser.parse_args()
        # sample_id = args["id"]
        audio_title = "{}.mp3".format(sample_id)
        path = find_in_subdirs(AUDIO_DIR, audio_title)
        # print(AUDIO_DIR)
        # print(path)
        return send_from_directory(path.parent, audio_title)


class Coordinates(Resource):
    @cors.crossdomain(origin="*")
    def get(self):
        return json.dumps(coordinates, cls=NumpyEncoder, indent=4)


class SimilarityID(Resource):
    @cors.crossdomain(origin="*")
    def get(self, sample_id):
        # sample_id = args["id"]
        args = parser.parse_args()
        num_results = args["results"] or 20
        # print(sample_id)

        D, I = index.search(
            np.array([index.reconstruct(int(sample_id))]), k=num_results
        )

        out = list(item for item in soundscape.metadata if item["id"] in I.flatten())
        return json.dumps(out, cls=NumpyEncoder, indent=4)


class SimilarityVector(Resource):
    @cors.crossdomain(origin="*")
    def get(self):
        args = parser.parse_args()
        x = args["x"] or 0
        y = args["y"] or 0
        z = args["z"] or 0
        num_results = args["results"] or 20

        D, I = index.search(np.array([[x, y, z]]).astype("float32"), k=num_results)

        out = list(item for item in soundscape.metadata if item["id"] in I.flatten())
        return json.dumps(out, cls=NumpyEncoder, indent=4)


# Setup the API resource routing here
# Route the URL to the resource
api.add_resource(Audio, "/audio/<int:sample_id>")
api.add_resource(Coordinates, "/coordinates")
api.add_resource(SimilarityVector, "/similar/vector")
api.add_resource(SimilarityID, "/similar/id/<int:sample_id>")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8888)
