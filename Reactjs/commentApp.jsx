class Comment extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCommentEdit(evt) {
        this.props.fnEdit(this.props.commentId, this._editedText.value);
    }

    render() {
        var commentTxt = (!this.props.editable) ?
            (<p>{this.props.children}</p>) :
            (<input type="text" className="form-control" ref={c => this._editedText = c} defaultValue={this.props.children} />);

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
        this.state = {
            numElems: 2,
            lst: [
                {"id": 0, "text": "This is a dummy comment", "editable": false},
                {"id": 1, "text": "The review was great! Wonderful!", "editable": false}
            ],
        };

        this.addComment = this.addComment.bind(this);
        this.retrieveComment = this.retrieveComment.bind(this);
    }

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

    enableEditComment (commentId) {
        var comment = this.retrieveComment(commentId);
        comment.object.editable = true;
        var _lst = this.state.lst.slice();
        _lst[comment.index] = comment.object;
        this.setState({lst: _lst});
    }

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