import TaskCrudView from "../components/task-crud-widget";
import UserCrudView from "../components/user-crud-widget";

const LandingView = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <h1 className="py-6 text-center text-2xl font-bold">
                Landing View
            </h1>

            <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-8 lg:grid-cols-2">
                <section className="rounded border bg-white p-4 shadow-sm">
                    <TaskCrudView />
                </section>
                <section className="rounded border bg-white p-4 shadow-sm">
                    <UserCrudView />
                </section>
            </div>
        </div>
    );
};

export default LandingView;
export { TaskCrudView, UserCrudView };
