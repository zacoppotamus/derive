"""
This file is responsible for labeling, clustering, and
reducing the dimensions of the provided metadata
"""
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans
from shutil import copy2
from utils.tags import clean_tag_list

import logging
import json
import numpy as np
import os
import pandas as pd
import pickle

logging.basicConfig(
    format="%(asctime)s %(levelname)s: %(message)s", datefmt="%I:%M:%S %p"
)


def tags2vecs(tags, model):
    tag_vector_space = []
    for t in tags:
        try:
            tag_vector_space.append(model[t])
        except KeyError:
            pass
    return np.array(tag_vector_space)


# This class is responsible for generating and querying a latent space
# from a list of sound metadata
class SonicCity:
    def __init__(
        self,
        metadata=[],
        model=None,
        name="urban",
        reduced_dims=3,
        output_folder="neighborhoods/urban",
    ):
        # name of the soundscape
        self.name = name

        # to store T-SNE latent space
        self.reduced = None
        self.reduced_dims = reduced_dims

        # serialized word embeddings
        self.model = model

        # storing phenotypal sonic clusters
        self.neighborhoods = []

        # store all pkl files here
        self.output_folder = output_folder

        try:
            os.makedirs(self.output_folder)
        except OSError:
            pass

        self.metadata = metadata
        for s in self.metadata:
            # the averaged tag vector
            # print(s["tags"])
            # print(clean_tag_list(s["tags"]))
            # print(self.model)
            s["tags_vec"] = tags2vecs(clean_tag_list(s["tags"]), self.model).mean(0)

        self.pickle(self.output_folder)

    def __create_latent_space(self):
        return list(map(lambda s: s["tags_vec"], self.metadata))

    # Copies audio samples to folders
    def samples_to_files(self, output_path="neighborhoods"):
        for cluster in range(self.kmeans.get_params()["n_clusters"]):
            cluster_mp3_folder = "{}/{}_sounds/{}".format(
                output_path, self.name, str(cluster)
            )
            os.makedirs(cluster_mp3_folder, exist_ok=True)
            for s in list(filter(lambda x: x["__label"] == cluster, self.metadata)):
                copy2(s["filename"], cluster_mp3_folder)

    # Writes samples to DB
    def samples_to_db(self):
        return

    def label_neighborhoods(self, n_clusters=8):
        # essentially k-means
        X = self.reduced if self.reduced else self.tsne()

        self.kmeans = KMeans(n_clusters=n_clusters, random_state=0).fit(X)
        logging.info("Finished k-means")
        for idx, s in enumerate(self.metadata):
            s["coordinates"] = X[idx].tolist()
            del s["tags_vec"]
            s["__label"] = self.kmeans.labels_[idx]
        self.pickle(self.output_folder)
        return

    def closest_neighbors_by_distance(self, dist):
        # This will probably be implemented using FAISS on the
        # dim-reduced .pkl file
        return

    def output_neighborhoods(self):
        return

    def tsne(self, ndim=3):
        if self.reduced_dims:
            ndim = self.reduced_dims
        X = np.array(self.__create_latent_space())
        logging.info("Reducing dimensions...")
        self.reduced = TSNE(n_components=ndim).fit_transform(X)
        logging.info("Finished reducing dimensions")
        self.pickle(self.output_folder)
        return self.reduced

    def pickle(self, output_path="neighborhoods"):
        # p = "{}/{}.pkl".format(output_path, self.name)
        p = os.path.join(output_path, "{}.pkl".format(self.name))
        with open(p, "wb") as f:
            pickle.dump(self, f)

    def neighborhoods_to_json(self, output_path="neighborhoods"):
        # p = "{}/{}".format(output_path, self.name)
        # p = os.path.join(output_path, self.name)
        df = pd.DataFrame(
            [
                {
                    "avg_rating": s["avg_rating"],
                    "description": s["description"],
                    "name": s["name"],
                    "filename": s["filename"],
                    "tags": s["tags"],
                    "coordinates": s["coordinates"],
                    "label": s["__label"],
                }
                for s in self.metadata
            ]
        )
        for cluster in range(self.kmeans.get_params()["n_clusters"]):
            df[df["label"] == cluster].to_json(
                os.path.join(output_path, "{}.json".format(str(cluster))),
                # "{}/{}.json".format(p, str(cluster)),
                orient="records",
                indent=2,
            )
            df[df["label"] == cluster]["name"].to_csv(
                os.path.join(output_path, "neighborhood_{}.csv".format(str(cluster))),
                index=False,
            )
        return
