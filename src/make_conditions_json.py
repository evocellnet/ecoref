#!/usr/bin/env python

if __name__ == '__main__':
    import os
    import sys
    import json
    import pandas as pd

    m = pd.read_table('data/conditions.tsv', sep='\t')
    m.set_index('Label', inplace=True)
    d = {}
    d['data'] = {}
    for c, x in zip(m.index, m.values):
        d['data'][c] = {k:v if str(v) != 'nan'
                        else ''
                        for k,v in zip(m.columns, x)}
    print(json.dumps(d))
