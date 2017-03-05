import React from 'react';
import decode from 'ent/decode';
import { TextArea } from 'semantic-ui-react';

const PostLink = ({ post, updatePost, editable }) => {
    return(
        <div className="post-link-wrapper">
            <div className="post-title">
                <TextArea
                    disabled={editable ? false : true}
                    value={decode(post.get('title'))}
                    autoHeight
                    onChange={(e) => updatePost.title(e.target.value)}
                />
            </div>
            <div className="post-description">
                 <TextArea
                    disabled={editable ? false : true}
                    value={ decode(post.get('description')) }
                    autoHeight
                    onChange={(e) => updatePost.description(e.target.value)}
                />
            </div>
            <div className="post-source">
                <a href={post.get('link')} target="_blank">
                    원문 링크 - {post.get('source')}
                </a>
            </div>
        </div>
    );
};

export default PostLink;
