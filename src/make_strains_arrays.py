#!/usr/bin/env python

if __name__ == '__main__':
    import json
    import sys
    import numpy as np
    import pandas as pd

    s = pd.read_table('data/strains.tsv', sep='\t')
    sname = s.set_index(s.columns[0])[s.columns[1]].to_dict()

    a = pd.read_table('data/sscores.txt')
    a.set_index(a.columns[0], inplace=True)

    f = pd.read_table('data/fdr.txt')
    f.set_index(f.columns[0], inplace=True)

    f[np.isnan(a)] = np.nan

    v = a[a < 0][f < 0.05]
    v[np.invert(np.isnan(v))] = int(1)
    v[np.isnan(v)] = int(0)
    v[np.isnan(a)] = np.nan
    
    z = a[f < 0.05]
    z[z > 0] = int(1)
    z[z < 0] = int(-1)
    z[np.isnan(z)] = int(0)
    z[np.isnan(a)] = np.nan

    m = pd.read_table('data/phenotypic_data.tsv', index_col=1)

    v.to_csv('data/binary.txt', sep='\t')
    z.to_csv('data/all_binary.txt', sep='\t')
    for strain in set(v.index):
        m.loc[strain].reset_index().set_index('condition').drop('strain', axis=1).to_csv('data/phenotypes/%s.tsv' % strain,
                                                                                         sep='\t')
    for condition in set(a.columns):
        d = {}
        d['data'] = []
        values = a[condition].dropna()
        pvalues = f[condition].dropna()
        for strain in a[condition].dropna().index:
            if not strain.startswith('NT'):
                continue
            if values.loc[strain] < 0 and pvalues.loc[strain] < 0.05:
                phenotype = 'Sick'
            elif values.loc[strain] > 0 and pvalues.loc[strain] < 0.05:
                phenotype = 'Overgrown'
            else:
                phenotype = '-'
            d['data'].append({'id': strain,
                              'name': sname.get(strain, ''),
                              'sscore': float('%.2f' % values.loc[strain]),
                              'fdr': float('%.2f' % -np.log10(pvalues.loc[strain])),
                              'phenotype': phenotype})
        json.dump(d, open('json/conditions/%s.json' % condition,
                          'w'))
