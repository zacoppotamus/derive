AUDIO_FOLDER=derive/audio
EMBEDDINGS_FOLDER=derive/embeddings
METADATA_FOLDER=derive/metadata

neighborhoods: word_vectors metadata
	python derive/neighborhoods.py

word_vectors: embeddings
	python derive/serialize_word_vectors.py

embeddings:
	mkdir -p $(EMBEDDINGS_FOLDER)
	wget -P $(EMBEDDINGS_FOLDER) http://nlp.stanford.edu/data/glove.6B.zip
	unzip $(EMBEDDINGS_FOLDER)/glove.6B.zip -d $(EMBEDDINGS_FOLDER)
	find $(EMBEDDINGS_FOLDER)/* ! -name 'glove.6B.100d.txt' -type f -exec rm -f {} +

metadata:
	mkdir -p derive/metadata
	wget -P $(METADATA_FOLDER) https://archive.org/download/freesound4s/0_1.json.zip \
	https://archive.org/download/freesound4s/1_2.json.zip \
	https://archive.org/download/freesound4s/2_3.json.zip \
	https://archive.org/download/freesound4s/3_4.json.zip
	unzip '$(METADATA_FOLDER)/*.zip' -d $(METADATA_FOLDER)
	rm $(METADATA_FOLDER)/*.zip

# Need to rename samples because when they get unzipped,
# they're named mp3
samples:
	mkdir -p $(AUDIO_FOLDER)
	wget -P $(AUDIO_FOLDER) https://archive.org/download/freesound4s/0_1.mp3.zip \
	https://archive.org/download/freesound4s/1_2.mp3.zip \
	https://archive.org/download/freesound4s/2_3.mp3.zip \
	https://archive.org/download/freesound4s/3_4.mp3.zip
	unzip '$(AUDIO_FOLDER)/*.zip' -d $(AUDIO_FOLDER)
	rm $(AUDIO_FOLDER)/*.zip

hello:
	find $(EMBEDDINGS_FOLDER)/* ! -name 'glove.6B.100d.txt'