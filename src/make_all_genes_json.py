#!/usr/bin/env python

if __name__ == '__main__':
    import os
    import sys
    import json
    import pandas as pd

    m = pd.read_table('data/id_table.tsv', sep='\t', header=None)
    m.columns = ['locus',
                 'name',
                 'eck',
                 'uniprot']
    d = {}
    d['data'] = [] 
    for x in m.values:
        d['data'].append({k:v if str(v) != 'nan'
                          else ''
                          for k,v in zip(m.columns, x)})
    print(json.dumps(d))
