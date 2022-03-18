// @ts-check

(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();
    const container = document.querySelector('.editor');
    function updateContent(text) {
        
    }
    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'update':
                const text = message.text;
                updateContent(text);
                vscode.setState({ text });
                return;
        }
    });
    const state = vscode.getState();
    if (state) {
        updateContent(state.text);
    }
}());