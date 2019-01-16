import {html} from 'https://unpkg.com/htm@2.0.0/preact/standalone.mjs'

export default function SourceGithubProjectPreview({columns=[], onColumnsSelection}){
    return html`
        <form onChange=${({currentTarget}) => {
            onColumnsSelection(
                [...currentTarget.elements]
                    .filter(e => e.checked)
                    .map(({name}) => columns.find((({id}) => String(id) === String(name))))
            )
        }}>
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
                            <td><input type="checkbox" name="${c.id}"/></td>
                            <td>${ c.name }</td>
                        </tr>
                    `)
                    }
                </tbody>
            </table>
        </form>`
}