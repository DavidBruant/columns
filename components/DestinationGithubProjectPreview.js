import {html} from 'https://unpkg.com/htm@2.0.0/preact/standalone.mjs'

export default function DestinationGithubProjectPreview({columns=[], onColumnSelection}){
    return html`
        <form>
            <table>
                <thead>
                    <tr>
                        <th>Sélectionner colonne</th>
                        <th>Colonne</th>
                    </tr>
                </thead>
                <tbody>
                    ${ columns.map(c => html`
                        <tr>
                            <td><input type="radio" name="destination" onChange=${e => {onColumnSelection(c)}}/></td>
                            <td>${ c.name }</td>
                        </tr>
                    `)
                    }
                </tbody>
            </table>
        </form>`
}