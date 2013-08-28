#!/usr/bin/env python
import sys
import os
import fnmatch
import shutil
import re

def get_num_name(f):
    num = int(re.search(r'(\d{1,3})', f).group())
    name = re.search(r'(?:-)(\D+\mp3)', f).group()
    return (num, name)

if __name__ == '__main__':
    src = sys.argv[1] # directory to discover files from
    dst = sys.argv[2] # directory to normalize and put names to

    print 'read from', src
    print 'write to', dst
    step = 5
    window = 10

    all_path = {}

    for root, _, filenames in os.walk(src):
        for f in filenames:
            print 'Find file', f
            if fnmatch.fnmatch(f, '*.mp3'):
                srcfile = os.path.abspath(os.path.join(root, f))
                (num, name) = get_num_name(f)
                all_path[num] = (srcfile,name)

    for i in range(1,321,step):
        thisdir = os.path.abspath(os.path.join(dst, '%03d-%03d' % (i, i+window-1)))
        if not os.path.exists(thisdir):
            os.mkdir(thisdir)
        for j in range(i, i + window - 1):
            if j > 321:
                break
            srcfile = all_path[j][0]
            name = all_path[j][1]
            nf = '%03d%s' % (j, name)
            dstfile= os.path.abspath(os.path.join(thisdir, nf))
            # print 'XXXXXXXXXXXXX', dstfile
            shutil.copyfile(srcfile, dstfile)
            print 'Copied to ' + dstfile 
 

    print 'Finished!'
