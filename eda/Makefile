word_vectors:
	python derive/word_vectors.py

embeddings:
	mkdir -p derive/embeddings
	curl -X http://nlp.stanford.edu/data/glove.6B.zip derive/embeddings
	unzip derive/embeddings/glove.6B.zip
	find derive/embeddings/* ! -name 'glove.6B.100d.txt' -type f -exec rm -f {} +

metadata:
	mkdir -p derive/metadata
	curl -X https://archive.org/download/freesound4s/0_1.json.zip derive/metadata/
	curl -X https://archive.org/download/freesound4s/1_2.json.zip derive/metadata/
	curl -X https://archive.org/download/freesound4s/2_3.json.zip derive/metadata/
	curl -X https://archive.org/download/freesound4s/3_4.json.zip derive/metadata/
	unzip derive/metadata/*.zip
	rm derive/metadata/*.zip

samples:
	mkdir -p derive/audio

hello:
	echo Hi