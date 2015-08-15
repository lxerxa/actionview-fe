# Universal Redux Boilerplate

> <s>Isomorphic</s> [Universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) app with [redux](https://github.com/gaearon/redux) as Flux library and [redux-devtools](https://github.com/gaearon/redux-devtools) hot-reload tools

### Libraries

* [expressjs](http://expressjs.com/)
* [reactjs ^0.13](https://facebook.github.io/react/)
* [react-router ^1.0.0-beta3](http://rackt.github.io/react-router/tags/v1.0.0-beta3.html)
* [redux ^1.0.0-rc](https://github.com/gaearon/redux)
* [redux-devtools](https://github.com/gaearon/redux-devtools)
* [postcss](https://github.com/postcss/postcss)
* [cssnext](http://cssnext.io/)
* [webpack](http://webpack.github.io)
* [babel](http://babeljs.io)

## Documentation

### Async data-fetching

[shared/redux-resolver.js](https://github.com/savemysmartphone/universal-redux-boilerplate/blob/master/shared/redux-resolver.js) is the magic thing about the boilerplate. It's our tool for resolving promises (data-fetching) before server side render.

The resolver is available on the `store` instance through components context, use it to wrap your async actions in `componentWillMount` for data to be fetched before server side render:

```javascript
import { bindActionCreators } from 'redux';
import * as Actions from 'redux/actions/Actions';
[...]
static propTypes = {
  dispatch: PropTypes.func.isRequired
}

static contextTypes = {
  store: PropTypes.object.isRequired
}

componentWillMount() {
  const { dispatch } = this.props;
  const { resolver } = this.context.store;
  this.actions = bindActionCreators(Actions, dispatch);

  return resolver.resolve(this.actions.load, {id: 10});
}
```

The action `this.actions.load` will be resolved instantly on browser. On the other hand, on server side a first render `React.renderToString` is called to collect promises, resolve them and re-render with the correct data.

### How to / Installation

* `$ git clone -o upstream https://github.com/savemysmartphone/universal-redux-boilerplate.git`
* `$ cd universal-redux-boilerplate && npm install`
* `$ npm run dev`

(Don't forget to add your remote origin: `$ git remote origin git@github.com:xxx/xxx.git`)

### Update the boilerplate

You can fetch the upstream branch and merge it into your master:

* `$ git checkout master`
* `$ git fetch upstream`
* `$ git merge upstream/master`
* `$ npm install`

### Run in production

* `$ npm run build`
* `$ npm run prod`

### Learn more

* [Official ReactJS website](http://facebook.github.io/react/)
* [Official ReactJS wiki](https://github.com/facebook/react/wiki)
* [Official Flux website](http://facebook.github.io/flux/)
* [ReactJS Conf 2015 links](https://gist.github.com/yannickcr/148110d3ca658ad96c2b)
* [Learn ES6](https://babeljs.io/docs/learn-es6/)
* [ES6 Features](https://github.com/lukehoban/es6features#readme)

### Related projects

* [gaeron/redux-devtools/examples](https://github.com/gaearon/redux-devtools/blob/master/examples%2Ftodomvc%2FREADME.md)
* [iam4x/isomorphic-flux-boilerplate](https://github.com/iam4x/isomorphic-flux-boilerplate)
* [erikas/react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example)
