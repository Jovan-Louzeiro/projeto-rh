import GenericTable from "./GenericTable";
export default function Frequencia() { return <GenericTable title="Frequência" description="Acompanhe presença, faltas, atrasos e justificativas." resource="frequencia" headers={["Servidor", "Data", "Situação", "Justificativa"]} fields={["servidor", "data", "situacao", "justificativa"]} />; }
