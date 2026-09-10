export const LOGO_PREFEITURA_PADRAO = "/assets/logo-prefeitura-carutapera.png";

type Props = { src?: string; className?: string; alt?: string };

/** Logo configurável: a URL persistida pela API tem prioridade sobre o asset padrão. */
export default function PrefeituraLogo({ src, className = "", alt = "Prefeitura de Carutapera" }: Props) {
  return <img className={`prefeitura-logo ${className}`} src={src || LOGO_PREFEITURA_PADRAO} alt={alt} />;
}
