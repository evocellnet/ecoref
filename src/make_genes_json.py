#!/usr/bin/env python

def get_options():
    import argparse

    description = 'From gene conversion table to json'
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument('table',
                        help='Gene conversion table')
    parser.add_argument('strains',
                        help='strains list')

    return parser.parse_args()

if __name__ == "__main__":
    options = get_options()

    import os
    import json
    import pandas as pd
    from Bio import SeqIO

    m = pd.read_table(options.table, header=None)

    strains = {x.rstrip()
               for x in open(options.strains)}

    d = {}
    d.update(m.set_index(1)[3].to_dict())

    for g, u in d.items():
        try:
            os.mkdir('json/genes/%s' % g[:2])
        except:
            pass
        d = {}
        seq = next(SeqIO.parse('data/proteins/%s.fasta' % u, 'fasta'))
        d['protein'] = {'sequence': str(seq.seq) + '*',
                        'length': len(seq) + 1,
                        'uniprot': u}
        d['variants'] = []
        try:
            n = {}
            for l in open('data/variants/%s/%s.nonsyn.tsv' % (u[:3], u)):
                strain, mut = l.rstrip().split('\t')
                n[strain] = n.get(strain, [])
                n[strain].append(mut)
        except IOError:
            n = {}
        try:
            s = {}
            for l in open('data/variants/%s/%s.stop.tsv' % (u[:3], u)):
                strain, mut, desc = l.rstrip().split('\t')
                s[strain] = s.get(strain, [])
                s[strain].append(mut)
        except IOError:
            s = {}
        try:
            p = {x.rstrip()
                 for x in open('data/variants/%s/%s.pangenome.tsv' % (u[:3], u))}
        except IOError:
            p = {}
        if len(n) == 0 and len(s) == 0 and len(p) == 0:
            pass
        else:
            for strain in sorted(strains):
                v = {'ID': strain}
                if strain in p:
                    v['absent'] = 'true'
                    v['nonsyn'] = []
                    v['stop'] = []
                    # stop here
                else:
                    v['absent'] = 'false'
                    try:
                        nonsyn = [[x[0], x[1:-1], x[-1]]
                                  for x in n[strain]]
                    except KeyError:
                        nonsyn = []
                    try:
                        stop = [[x[0], x[1:-1], x[-1]]
                                  for x in s[strain]]
                    except KeyError:
                        stop = []
                    v['nonsyn'] = nonsyn
                    v['stop'] = stop
                    if len(nonsyn) == 0 and len(stop) == 0:
                        continue
                d['variants'].append(v)
       
        f = open('json/genes/%s/%s.json' % (g[:2], g), 'w')
        f.write(json.dumps(d))
        f.write('\n')
        f.close()
