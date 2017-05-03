#!/usr/bin/env python

if __name__ == '__main__':
    import os
    import sys
    import json
    import pandas as pd

    m = pd.read_table('data/conditions.tsv', sep='\t')
    m.columns = ['condition',
                 'chem1', 'conc1',
                 'chem2', 'conc2',
                 'temperature',
                 'aerobiosis',
                 'stress type',
                 'media']
    d = {}
    d['data'] = [] 
    for x in m.values:
        d['data'].append({k:v if str(v) != 'nan'
                          else ''
                          for k,v in zip(m.columns, x)})
    print(json.dumps(d))
