import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Admin/Siderbar'

export const AdminLayout = () => {
  return (
    <section className="h-screen">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </section>
  )
}
