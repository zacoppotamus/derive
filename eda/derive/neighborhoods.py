from utils.files import list_all_files
from utils.tags import generate_tags_from_synset_file
from os.path import join

# from multiprocessing import Pool
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors

import argparse
import fnmatch
import inspect
import json
import logging
import numpy as np
import os
import pandas as pd
import pickle
from SonicCity import SonicCity
import sys

logging.basicConfig(
    format="%(levelname)s: %(message)s",
    # datefmt="%I:%M:%S %p",
    level=logging.DEBUG,
)


def filter_metadata_files(metadata_files, tags, min_downloads=100, sound_root="audio"):
    filtered = []
    for metadata_file in metadata_files:
        metadata = json.load(open(metadata_file))
        metadata["filename"] = "{}/{}/{}.mp3".format(
            sound_root,
            metadata_file.split("/")[1],
            metadata_file.split("/")[-1].split(".json")[0],
        )
        if np.any(
            [
                tag in tags and metadata["num_downloads"] > min_downloads
                for tag in metadata["tags"]
            ]
        ):
            filtered.append(metadata)
    return filtered


# add parent directory to sys path to import relative modules
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


# def clean_tag_list(tags):
#     """
#     Tags with multiple words have a - added to them by Kyle.
#     split this up again and return an array of one-word tags that can be
#     placed in vector space by our model
#     """
#     return flatten([t.split("-") for t in tags])


# def tags2vecs(tags, model):
#     tag_vector_space = []
#     for t in tags:
#         try:
#             tag_vector_space.append(model[t])
#         except KeyError:
#             pass
#     return np.array(tag_vector_space)


def main(args):
    parser = argparse.ArgumentParser(
        description="Filters metadata from list of synonyms and produces a reduced-dimension latent space from the specified word2vec model"
    )

    # File options
    parser.add_argument(
        "-e",
        "--embeddings",
        dest="WORD2VEC_FILE",
        default="{dir}/embeddings/glove.6B.100d.txt.word2vec".format(dir=current_dir),
        type=str,
        help="Specify serialized embeddings to load into word2vec",
    )

    parser.add_argument(
        "-m",
        "--metadata",
        dest="METADATA_FOLDER",
        default="{dir}/metadata/".format(dir=current_dir),
        type=str,
        help="Specify the location of audio sample metadata",
    )

    parser.add_argument(
        "-s",
        "--sounds",
        dest="SOUNDS_FOLDER",
        default="{dir}/audio".format(dir=current_dir),
        type=str,
        help="Specify the location of audio files",
    )

    parser.add_argument(
        "-o",
        "--output-folder",
        dest="OUTPUT_FOLDER",
        default="{dir}/neighborhoods/".format(dir=current_dir),
    )

    parser.add_argument(
        "-n",
        "--neighborhood-name",
        dest="NEIGHBORHOOD_NAME",
        default="urban",
        type=str,
        help="The folder name for the outputted sonic neighborhood",
    )

    # Filtering options
    parser.add_argument(
        "-f",
        "--synsets",
        dest="SYNONYMS_FILE",
        default="{dir}/synsets/urban.json".format(dir=current_dir),
        type=str,
        help="Specify the location of tag filter synonyms (synonym sets)",
    )

    parser.add_argument(
        "-md",
        "--min-downloads",
        dest="MIN_DOWNLOADS",
        default=100,
        type=int,
        help="Minimum download threshold for a given audio sample",
    )

    # Dimensionality reduction options
    parser.add_argument(
        "-d",
        "--dims",
        dest="TSNE_DIMENSIONS",
        default=3,
        type=int,
        help="Specify the dimensions for the dimensionality reduction",
    )

    # Clustering options
    parser.add_argument(
        "-c",
        "--clusters",
        dest="NUM_CLUSTERS",
        default=12,
        type=int,
        help="How many clusters / neighborhoods should be generated from the metadata",
    )

    a = parser.parse_args()

    # Retrieve all nested JSON sample metadata
    logging.info("Recursively scanning metadata files...")
    all_metadata_files = list(list_all_files(a.METADATA_FOLDER, [".json"]))

    # Load serialized embeddings to memory
    logging.info("Loading embeddings to memory...")
    model = KeyedVectors.load_word2vec_format(a.WORD2VEC_FILE, binary=False)

    logging.info("Filtering metadata files...")
    filtered_metadata = filter_metadata_files(
        all_metadata_files,
        generate_tags_from_synset_file(a.SYNONYMS_FILE),
        a.MIN_DOWNLOADS,
        a.SOUNDS_FOLDER,
    )

    with open(os.path.join(a.OUTPUT_FOLDER, "filtered_metadata.pkl"), "wb") as outfile:
        pickle.dump(filtered_metadata, outfile)

    # filtered_metadata = pickle.load(
    #     open(os.path.join(a.OUTPUT_FOLDER, "filtered_metadata.pkl"), "rb")
    # )

    soundscape = SonicCity(
        metadata=filtered_metadata,
        model=model,
        name=a.NEIGHBORHOOD_NAME,
        reduced_dims=a.TSNE_DIMENSIONS,
        output_folder=os.path.join(a.OUTPUT_FOLDER, a.NEIGHBORHOOD_NAME),
    )

    soundscape.label_neighborhoods(n_clusters=a.NUM_CLUSTERS)
    soundscape.neighborhoods_to_json(os.path.join(a.OUTPUT_FOLDER, a.NEIGHBORHOOD_NAME))
    soundscape.pickle(os.path.join(a.OUTPUT_FOLDER, a.NEIGHBORHOOD_NAME))

    # soundscape.samples_to_files(a.OUTPUT_FOLDER)


if __name__ == "__main__":
    from sys import argv

    try:
        main(argv)
    except KeyboardInterrupt:
        pass
    sys.exit()
