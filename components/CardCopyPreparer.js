import {html} from 'https://unpkg.com/htm@2.0.0/preact/standalone.mjs'

export default function DestinationGithubProjectPreview({domain, sourceProject, destinationProject, sourceColumns, destinationColumn, cardsByColumn, cardsToCopy}, onTransferConfirm){
    return html`
        <form onSubmit=${e => {
            e.preventDefault()
            onTransferConfirm(destinationColumn, cardsToCopy)
        }}>
            ${
                (!(sourceProject && destinationProject && sourceColumns && destinationColumn && cardsByColumn && cardsToCopy)) ? 
                    undefined : 
                    html`<div>
                            <h3>In ${domain.org ? 'org': 'repo'} ${domain.org ? domain.org : `${domain.owner}/${domain.repo}`}</h3>
                            <p>Tranfer from project <a href="${sourceProject.html_url}">${sourceProject.name}</a> columns ${sourceColumns.map(col => {
                                return `${col.name} (${cardsByColumn.get(col).length} cards)`
                            }).join(', ')} ${`(total ${cardsToCopy.length}`} cards) to project <a href="${destinationProject.html_url}">${destinationProject.name}</a> column ${destinationColumn.name}</p>
                        </div>
                    `
            }
            <button type="submit">Go!</button>
        </form>`;
}
