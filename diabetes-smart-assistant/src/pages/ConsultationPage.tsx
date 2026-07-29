import { ChevronRight, Clock3, MessageCircleMore, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { doctors } from '../data/demo'

export function ConsultationPage() {
  return (
    <div className="page-stack">
      <PageHeader title="医生咨询" />
      <section className="consult-intro"><Stethoscope size={28} /><div><h2>专业健康支持</h2><p>按专长选择医生，留言后由问诊服务处理。</p></div></section>
      <div className="doctor-list">
        {doctors.map((doctor) => (
          <article className="doctor-list-item" key={doctor.id}>
            <div className="doctor-photo doctor-photo--large"><img src={doctor.image} alt={`${doctor.name}${doctor.title}`} />{doctor.online ? <span /> : null}</div>
            <div className="doctor-list-item__body"><div><h2>{doctor.name}</h2><span>{doctor.title}</span></div><p>{doctor.department}</p><small>{doctor.specialty}</small><div className="doctor-status"><Clock3 size={14} />{doctor.online ? '当前可留言' : '预计明日回复'}</div></div>
            <Link className="icon-button doctor-enter" to={`/doctors/${doctor.id}`} aria-label={`咨询${doctor.name}`}><ChevronRight size={21} /></Link>
          </article>
        ))}
      </div>
      <div className="medical-disclaimer"><MessageCircleMore size={16} /> 在线咨询不用于急症处理，紧急情况请及时联系当地急救服务。</div>
    </div>
  )
}
