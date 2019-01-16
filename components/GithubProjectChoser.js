import {html} from 'https://unpkg.com/htm@2.0.0/preact/standalone.mjs'

export default function GithubProjectsChoser({projects=[], onSourceChange, onDestinationChange}){
    return html`
        <table>
            <thead>
                <tr>
                    <th>Source</th>
                    <th>Github project</th>
                    <th>Destination</th>
                </tr>
            </thead>
            <tbody>
                ${ projects.map(p => html`
                    <tr>
                        <td><input type="radio" name="source" onChange=${e => {onSourceChange(p)}}/></td>
                        <td>${ p.name }</td>
                        <td><input type="radio" name="destination" onChange=${e => {onDestinationChange(p)}}/></td>
                    </tr>
                `)
                }
            </tbody>
        </table>`
}