import json

flatten = lambda l: [item for sublist in l for item in sublist]


def clean_tag_list(tags):
    """
    Tags with multiple words have a - added to them by Kyle.
    split this up again and return an array of one-word tags that can be
    placed in vector space by our model
    """
    return flatten([t.split("-") for t in tags])


def generate_tags_from_synset_file(path):
    # synsets are in nested json format
    return flatten(json.load(open(path)))
