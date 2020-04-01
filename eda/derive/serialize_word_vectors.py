import argparse
import inspect
import sys
import os

from gensim.scripts.glove2word2vec import glove2word2vec

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


def main(args):
    parser = argparse.ArgumentParser(
        description="Generate word embeddings (.word2vec) from a .txt word vector file"
    )

    # File options
    parser.add_argument(
        "-e",
        "--embeddings",
        dest="EMBEDDINGS_FILE",
        default="{dir}/embeddings/glove.6B.100d.txt".format(dir=current_dir),
        type=str,
        help="Specify pre-trained word vectors to serialize",
    )
    parser.add_argument(
        "-o",
        "--output",
        dest="OUTPUT_FILE",
        default="{dir}/embeddings/glove.6B.100d.txt.word2vec".format(dir=current_dir),
        type=str,
        help="Specify the location of the serialized file",
    )

    a = parser.parse_args()
    aa = vars(a)

    print("Serializing word vectors...")
    glove2word2vec(a.EMBEDDINGS_FILE, a.OUTPUT_FILE)
    print("Done")


if __name__ == "__main__":
    from sys import argv

    try:
        main(argv)
    except KeyboardInterrupt:
        pass
    sys.exit()
