# grandpa
#
#### If you're like your grandpa and don't want to do a lot of work, this tool can help you :)
#
##### This tool helps you to find subdomains easier.
##### After running program, public path will be created 
##### In public path a directory will be created with the given name of the site containing a subdomains_enum.txt file.
##### This file includes discovered subdomains. In the same directory another path will be made under the name of images which saves screen shots taken from discovered subdomains.
##### You can open localhost:3000 address in your browser to see result graphic mode(wait for discovering all the subdomains)
#
#### Developer assume no liability and are not responsible for any misuse or damage.
#
#### Install
```sh
git clone https://github.com/Galaxy-sc/grandpa
cd grandpa
npm i
```
#### Help
```sh
node grandpa.js --help
```

#### Run
```sh
node grandpa.js -u your_site
```

#### Features
```
  -s        Enter the status code with this switch, example: -s 200,301,403...
  
  -f        Enter the subdomain file list path, example: -f list.txt  (default list subdomain_brute.txt)

  -ns no    If you don't want to see the result on the web as a GUI, use this switch.

  -nsh no   If you don't want to take screenshots of subdomains, use this switch.

  -nb no    With this switch, the banner will not be displayed.

  -ds       Specify the delay in each screenshot with this switch, example: -ds 2000 (2000 means 2 seconds and is set to 1 seconds by default.)
```