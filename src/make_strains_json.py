#!/usr/bin/env python

if __name__ == '__main__':
    import os
    import sys
    import json
    import pandas as pd

    phenotypes = {x.split('.')[0] for x in os.listdir('data/phenotypes')}
    g = pd.read_table('data/genomes.tsv', sep=' ', header=None)
    g.set_index(g.columns[0], inplace=True)
    c = pd.read_table('data/contact.tsv')
    c.set_index(c.columns[0], inplace=True)
    m = pd.read_table('data/strains.tsv')
    m.columns = ['id',
                 'name',
                 'exp',
                 'eparent',
                 'altname',
                 'fullname',
                 'ena',
                 'altgenome',
                 'refs',
                 'isolation',
                 'year',
                 'phenotype',
                 'bsl',
                 'notes']
    m['refs'] = [' '.join(str(x).split(';')) for x in m['refs']]
    assembly = []
    for x in m['id']:
        if x in set(g.index):
            v = g.loc[x][1]
            if type(v) == str:
                assembly.append(v)
            else:
                assembly.append(' '.join(v))
        else:
            assembly.append('')
    m['owner'] = [c.loc[x]['owner'] for x in m['id']]
    m['website'] = [c.loc[x]['website'] for x in m['id']]
    m['email'] = [c.loc[x]['email'] for x in m['id']]
    m['mta'] = ['No' if str(c.loc[x]['mta']) == 'nan' else 'Yes'
                for x in m['id']]

    m['assembly'] = assembly
    m['phenotypes'] = [x+'.tsv' if x in phenotypes else '' for x in m['id']]
    d = {}
    d['data'] = []
    for x in m.values:
        d['data'].append({k:v if str(v) != 'nan'
                          else ''
                          for k,v in zip(m.columns, x)})
    print(json.dumps(d))
