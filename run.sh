#!//bin/bash

python src/make_all_conditions_json.py > json/all_conditions.json
python src/make_conditions_json.py > json/conditions.json
python src/make_conditions_arrays.py
python src/make_strains_arrays.py
python src/make_strains_json.py > json/strains.json
