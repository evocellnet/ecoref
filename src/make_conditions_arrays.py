#!/usr/bin/env python

if __name__ == '__main__':
    import sys
    import json
    import numpy as np
    import pandas as pd

    a = pd.read_table('data/sscores.txt')
    a.set_index(a.columns[0], inplace=True)

    for condition in a.columns:
        json.dump(list(a[condition].dropna().values),
                  open('data/conditions/%s.tsv' % condition, 'w'))
    json.dump(sorted(list(a.columns)),
              open('data/conditions/all.txt', 'w'))
