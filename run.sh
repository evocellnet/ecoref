#!/bin/bash

python src/make_all_conditions_json.py > json/all_conditions.json
python src/make_conditions_json.py > json/conditions.json
python src/make_conditions_arrays.py
python src/make_strains_arrays.py
python src/make_strains_json.py > json/strains.json
python src/make_conversion_json.py data/id_table.tsv > json/conversions.json
python src/make_all_genes_json.py > json/all_genes.json
