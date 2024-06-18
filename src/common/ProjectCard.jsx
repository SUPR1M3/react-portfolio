import React from 'react';

function ProjectCard(props) {
  return (
    <a href={props.link} target='_blank'>
        <img className='hover' src={props.icon} alt="Viberr icon"/>
        <h3>{props.heading}</h3>
        <p>Streaming App</p>
    </a>
  )
}

export default ProjectCard