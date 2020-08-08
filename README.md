# MongoDB query highlighter for CLI

- built for CLI
- (almost) dependency free

## 🚀 Quick Start

```
$ yarn add @mikro-orm/mongo-highlighter
```

or

```
$ npm i -s @mikro-orm/mongo-highlighter 
```

Usage:

```typescript
import { MongoHighlighter } from '@mikro-orm/mongo-highlighter';

const highlighter = new MongoHighlighter();
const ret = highlighter.highlight(`db.getCollection('author').insertOne({ createdAt: ISODate('2020-01-01T12:00:00Z'), updatedAt: ISODate('2020-01-01T12:00:00Z'), foo: 'bar', name: 'Jon Snow', email: 'snow@wall.st', termsAccepted: false }, { session: '[ClientSession]' });`);
console.log(ret);
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome. 

## Authors

👤 **Martin Adámek**

- Twitter: [@B4nan](https://twitter.com/B4nan)
- Github: [@b4nan](https://github.com/b4nan)

See also the list of contributors who [participated](https://github.com/mikro-orm/mikro-orm/contributors) in this project.

## Show Your Support

Please ⭐️ this repository if this project helped you!

## 📝 License

Copyright © 2020 [Martin Adámek](https://github.com/b4nan).

This project is licensed under the MIT License - see the [LICENSE file](LICENSE) for details.
