import React from 'react';
import decode from 'ent/decode';
import { TextArea, Form } from 'semantic-ui-react';

const PostLink = ({ post, updatePost, editable }) => {
    return(
        <div className="post-link-wrapper">
            <div className="post-title">
                <Form>
                    <TextArea
                        disabled={editable ? false : true}
                        value={decode(post.get('title'))}
                        autoHeight
                        onChange={(e) => updatePost.title(e.target.value)}
                    />
                 </Form>
            </div>
            <div className="post-description">
                <Form>
                     <TextArea
                        disabled={editable ? false : true}
                        value={ decode(post.get('description')) }
                        autoHeight
                        onChange={(e) => updatePost.description(e.target.value)}
                    />
                </Form>

            </div>
            <div className="post-source">
                <a href={post.get('link')} target="_blank">
                    <b>원문 링크</b>
                </a>
            </div>
        </div>
    );
};

export default PostLink;
