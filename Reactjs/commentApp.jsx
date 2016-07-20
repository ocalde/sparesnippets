class Comment extends React.Component {
    constructor(props) {
        super(props);
    }

    //Invoked from Save button, to call parent function and update parent state
    handleCommentEdit(evt) {
        this.props.fnEdit(this.props.commentId, this._editedText.value);
    }

    render() {
        //Based on editable status, render readonly text or editable text
        var commentTxt = (!this.props.editable) ?
            (<p>{this.props.children}</p>) :
            (<input type="text" className="form-control" ref={c => this._editedText = c} defaultValue={this.props.children} />);

        //Based on editable status, render button to enable edition or to save changes
        var editBtn = (this.props.editable) ?
            (<button onClick={this.handleCommentEdit.bind(this)} className="btn btn-success">Save</button>) :
            (<button onClick={this.props.fnEnableEdit} className="btn btn-primary">Edit</button>);

        return (
            <section className="well" data-lstidx={this.props.idx}>
                {commentTxt}
                {editBtn}
                <button onClick={this.props.fnRemove} className="btn btn-danger">Delete</button>
            </section>
        );
    }
}

class CommentsList extends React.Component {
    constructor(props) {
        super(props);
        //Set default comment list. It can be rendered from API
        this.state = {
            numElems: 2,
            lst: [
                {"id": 0, "text": "This is a dummy comment", "editable": false},
                {"id": 1, "text": "The review was great! Wonderful!", "editable": false}
            ],
        };

        //Bind of add comment and retrieve comment method
        this.addComment = this.addComment.bind(this);
        this.retrieveComment = this.retrieveComment.bind(this);
    }

    //Invoked from child component
    removeComment (commentId) {
        var newLst = this.state.lst.filter((val) => {return val.id != commentId; });
        this.setState({lst: newLst});
    }

    addComment (evt) {
        var _numElems = this.state.numElems++;
        this.setState({lst:
            this.state.lst.concat(
                {"numElems": _numElems, "id": _numElems, "text": this._newText.value, "editable": false}
            )});
    }

    retrieveComment(commentId) {
        var cmmt = this.state.lst.find(obj => { return obj.id == commentId; });
        var idx = this.state.lst.indexOf(cmmt);
        return {"index": idx, "object": cmmt};
    }

    //Changes comment status to editable, re-rendering it with a textfield and save button
    enableEditComment (commentId) {
        var comment = this.retrieveComment(commentId);
        comment.object.editable = true;
        var _lst = this.state.lst.slice();
        _lst[comment.index] = comment.object;
        this.setState({lst: _lst});
    }

    //Saves edited comment
    editComment (commentId, commentText) {
        var comment = this.retrieveComment(commentId);
        comment.object.editable = false;
        comment.object.text = commentText;
        var _lst = this.state.lst.slice();
        _lst[comment.index] = comment.object;
        this.setState({lst: _lst});
    }

    render() {
        var lstComms = this.state.lst.map((cmt, idx) => {
            return (
                <Comment key={cmt.id}
                    commentId={cmt.id}
                    editable={cmt.editable}
                    fnRemove={this.removeComment.bind(this, cmt.id)}
                    fnEnableEdit={this.enableEditComment.bind(this, cmt.id)}
                    fnEdit={this.editComment.bind(this)}>{cmt.text}</Comment>
            )
        });
        return (
            <div id="feedReader">
                {lstComms} <br />
                <input type="text" ref={c => this._newText = c} className="form-control" /><br />
                <button onClick={this.addComment} className="btn btn-success">Add new</button>
            </div>
        );
    }
}

ReactDOM.render(<CommentsList />, document.getElementById("app"));
