import React from "react";

export default class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: null
        }
    }
    static contextTypes = {
        user: React.PropTypes.object
    };
    componentDidMount = () => {
        fetch("/comments", {
            method: "post",
            body: JSON.stringify({data: this.props.question}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if (json.comments.length > 0) {
               this.setState({
                 comments: json.comments
               });
            } 
        });
    };
    handleComments = () => {
        let comment = document.getElementById("comment-create").value;
        fetch("/create-comment", {
            method: "post",
            body: JSON.stringify({data: [comment, this.props.question]}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
           return res.json();
        }).then((json) => {
            this.setState({
                comments: json.newComments
            });
        });
    };
    handleLikeDislike = (e) => {
        if (!this.context.user) {
            return;
        }
        let currentComment = e.target.previousSibling;
        currentComment = e.target.previousSibling.getAttribute("class") === "comment" ? currentComment : currentComment.previousSibling;
        console.log(currentComment);
        fetch("/update", {
            method: "post",
            body: JSON.stringify({question: this.props.question, id: e.target.getAttribute("class"), username: this.context.user.givenName, comment: currentComment.getAttribute("id")}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
        return res.json()
        }).then((json) => {
             this.setState({
                comments: json.data
            });
        });
    }
    render() {
        let message = this.context.user ? null : "You must login before you can like or dislike comments"
        let comments = this.state.comments ? (
            <div id="comment-box">
              {this.state.comments.map((ele, index) => {
                  return (
                      <div key={index} className="current-comment-box">
                        <h5>{ele.date}</h5>
                        <p className="comment" id={index}>{ele.comment}</p>
                        <button className="like" onClick={this.handleLikeDislike}>Like ({ele.likes})</button>
                        <button className="dislike" onClick={this.handleLikeDislike}>Dislike ({ele.dislikes})</button>
                      </div>
                  )
              })}
            </div>
        ) : null;
        return (
            <div id="comment-container">
              <h3>Comments ({this.state.comments ? this.state.comments.length : 0})</h3>
              <h3 id="message">{message}</h3>
              <textarea id="comment-create" placeholder="Discuss your thoughts here!"></textarea>
              <button id="comment-button" onClick={this.handleComments}>Create Comment</button>
              {comments}
            </div>
        )
    }
}