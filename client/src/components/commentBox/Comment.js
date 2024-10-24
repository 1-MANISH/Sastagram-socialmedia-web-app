import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'

import UserAvatar from '../avatar/UserAvatar'
import "./CommentBox.scss"

function Comment({comment}) {

    const [expanded, setExpanded] =useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <Box className='comment' component="section" sx={{ p: 5, borderLeft: '1px dashed grey' }}>
            <div className='commentHeader'
            >
                <Typography sx={{ width: '10%', flexShrink: 0 }}>
                    <UserAvatar user={comment.commentBy}/>
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{comment.commentBy.name}</Typography>
            </div>
            <div className='commentMessage'>
                <Typography sx={{ml:5.8}}>
                    {comment.message}
                </Typography>
                <Typography sx={{ml:5.8,fontSize:"0.7rem"}}>
                    {comment.commentAgo}
                </Typography>
            </div>
        </Box>
    )
}

export default Comment
