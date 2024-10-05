function Message() {
    const name = "Lucas";
    if (name) 
        return <h1>Hello, {name}</h1>;
    return <h1>Hello, John</h1>;
}

export default Message;