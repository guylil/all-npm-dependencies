const express = require('express');
const app = express();
app.use(express.json());
const request = require('request');
const requestPromise = require('request-promise-native');

app.get('/v1/:package/:version',async function(req, res, next) {
    res.json(await getDependenciesTree(req.params.package, req.params.version));
});

app.get('/*', function (req, res, next) {
    res.json({response: 'We could not process your request'});
});


const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));


async function getDependenciesTree(package, version) {
    const dependenciesTree = {package, version, dependencies:[]};
    dependenciesTree.dependencies = await getDependencies(package, version);
    if (dependenciesTree.dependencies.length > 0) {
        for (let dependency of dependenciesTree.dependencies) {
            dependenciesTree.dependencies[dependenciesTree.dependencies.indexOf(dependency)] = await getDependenciesTree(dependency.package, dependency.version);
        }
    }
    return dependenciesTree
}

async function getDependencies(package, version) {
    const dependenciesList = [];
        return await requestPromise({uri:`https://registry.npmjs.org/${package}/${version}`, json:true})
            .then(function (response) {
                if (response['dependencies']) {
                    for (let [packageName, version] of Object.entries(response['dependencies'])) {
                        if (version.startsWith('~')) {version = version.slice(1)}
                        if (version.startsWith('>=')) {version = version.slice(3, version.indexOf(' <'))}
                        dependenciesList.push({package: packageName, version: version})
                    }
                    return dependenciesList
                } else {
                    return []
                }
            });
}

module.exports.getDependencies = getDependencies;
module.exports.getDependenciesTree = getDependenciesTree;
