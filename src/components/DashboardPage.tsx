const DashboardPage = (): React.ReactNode => {
    const loginAcessToken = localStorage.getItem('accessToken');
    
    return (
        <div>DashboardPage {loginAcessToken}</div>
    )
}

export default DashboardPage