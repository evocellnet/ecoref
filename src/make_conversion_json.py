#!/usr/bin/env python

def get_options():
    import argparse

    description = 'From gene conversion table to json'
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument('table',
                        help='Gene conversion table')

    return parser.parse_args()

if __name__ == "__main__":
    options = get_options()

    import json
    import pandas as pd

    m = pd.read_table(options.table, header=None)

    d = {}
    d.update(m.set_index(1)[3].to_dict())

    print(json.dumps(d))
