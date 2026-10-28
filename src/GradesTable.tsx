import type { DocEntry } from "./types";

/** Every section with its status and grade, in reading order. It marks nothing as "to fix" (FR-004, TR-002). */
export function GradesTable({ documents }: { documents: DocEntry[] }) {
    const sections = documents.filter((d) => d.section !== null);
    return (
        <table className="grades">
            <caption>Grades</caption>
            <thead>
                <tr>
                    <th scope="col">Section</th>
                    <th scope="col">Status</th>
                    <th scope="col">Score</th>
                    <th scope="col">Blocking defects</th>
                    <th scope="col">Graded</th>
                </tr>
            </thead>
            <tbody>
                {sections.map((d) => (
                    <tr key={d.file}>
                        <th scope="row">{d.section}. {d.title}</th>
                        <td>{d.status}</td>
                        {d.grade ? (
                            <>
                                <td>{d.grade.score}</td>
                                <td>{d.grade.blocking}</td>
                                <td>{d.grade.graded ?? "no date"}</td>
                            </>
                        ) : (
                            <td colSpan={3}>Not graded</td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
