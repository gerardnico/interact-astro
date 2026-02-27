# Git


## Support

### warning: in the working copy of 'image.png', CRLF will be replaced by LF the next time Git touches it

Adapt your `.gitattributes`
```
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.webp binary

# all files LF
*.cmd text eol=crlf
*.bat text eol=crlf
* text eol=lf
```