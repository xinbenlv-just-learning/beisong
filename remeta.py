#!/usr/bin/env python
# Need to pip install eyeD3 
import sys
import os
import fnmatch
import shutil
import eyed3

if __name__ == '__main__':
    src = sys.argv[1] # directory to discover files from
    dryrun = True 
    print 'read from', src
    step = 5
    window = 10

    all_path = {}

    for root, _, filenames in os.walk(src):
        for f in filenames:
            print 'Find file', f
            if fnmatch.fnmatch(f, '*.mp3'):
                srcfile = os.path.abspath(os.path.join(root, f))

                audiofile = eyed3.load(srcfile)
                if audiofile.tag:
                    print 'title', audiofile.tag.title
                else:
                    print 'WARNING NO AUDIOFILE', srcfile,'======================================='
                    audiofile.tag = eyed3.id3.Tag()
                    audiofile.tag.file_info = eyed3.id3.FileInfo(srcfile)
                audiofile.tag.title = unicode(f, "utf-8")
                audiofile.tag.save()
                print 'Processed', f
    print 'Finished!'
