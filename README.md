## Elasticsearch for VSCode

This project is a fork of [@hsen-dev/vscode-elastic](https://github.com/hsen-dev/vscode-elastic) with new features and improvements.

A Visual Studio Code extension for managing and querying Elasticsearch clusters.

### Features

- Connect to multiple Elasticsearch clusters
- Execute and save queries
- View and manage indices
- Monitor cluster health
- Syntax highlighting for Elasticsearch DSL

### Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Elasticsearch for VSCode"
4. Click Install

### Usage

-   Open an existing file with a `.esql` file extenion or open a new text file (`ctrl+n`) and change the language mode to `Elasticsearch (esql)` by pressing `ctrl+k,m` and select `esql`. Elasticsearch queries and funtionalities are enabled in the esql language mode in Visual Studio Code editor.
-   For https endpoints, just add protocol type in url : `https://host`
-   For auth protected clusters, you can use `http://user:pass@host:9200` as the endpoint url to have it auth.

### Submit requests

Simple way:

```text
GET /my-index/_search
{
    "size":7,
    "query": {
        "match" : {
            "message" : {
                "query" : "this is a test"
            }
        }
    }
}
```

Get payload from file:

```text
PUT /my-index
!./opt/elasticsearch/mapping.json
```

## Commands

-   **Elasticsearch: Set Host** to create connection profile and connect.

## Keymaps

-   **Alt + Enter** / **Ctrl + Enter** to execute selected query.

## Roadmap

-   Work with multi host
-   User Authentication
-   IntelliSense like kibana autocomplete

### Development

#### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Visual Studio Code

#### Setup

1. Clone the repository
```bash
git clone https://github.com/[username]/elastic-query-studio.git
cd elastic-query-studio
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
