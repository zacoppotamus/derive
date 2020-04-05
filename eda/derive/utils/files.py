import os
import fnmatch

from pathlib import Path


def list_all_files(directory, extensions=None, exclude_prefixes=("__", ".")):
    for root, dirnames, filenames in os.walk(directory):
        filenames = [f for f in filenames if not f.startswith(exclude_prefixes)]
        dirnames[:] = [d for d in dirnames if not d.startswith(exclude_prefixes)]
        for filename in filenames:
            base, ext = os.path.splitext(filename)
            joined = os.path.join(root, filename)
            if extensions is None or ext.lower() in extensions:
                yield joined


def find_in_subdirs(parent_folder=".", file_name="20.mp3"):
    for path in Path(parent_folder).rglob(file_name):
        return path
