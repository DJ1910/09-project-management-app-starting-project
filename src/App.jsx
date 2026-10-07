import { useState } from "react";
import { v4 } from "uuid";

import NewProject from "./components/NewProject.jsx";
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import SelectedProject from "./components/SelectedProject.jsx";

function App() {
  const [projectList, setProjectList] = useState({
    projects: [],
    tasks: [],
    currentProjectDisplayedId: undefined,
  });

  function handleAddTask(task) {
    setProjectList((prevProjectList) => {
      const newTask = {
        task: task,
        id: v4(),
        projectId: prevProjectList.currentProjectDisplayedId,
      };
      return {
        ...prevProjectList,
        tasks: [newTask, ...prevProjectList.tasks],
      };
    });
  }

  function handleDeleteTask(id) {
    setProjectList((prevProjectList) => {
      return {
        ...prevProjectList,
        tasks: prevProjectList.tasks.filter((task) => task.id !== id),
      };
    });
  }

  function handleSelectProject(id) {
    setProjectList((prevProjectList) => {
      return { ...prevProjectList, currentProjectDisplayedId: id };
    });
  }

  function handleDeleteProject() {
    setProjectList((prevProjectList) => {
      return {
        ...prevProjectList,
        currentProjectDisplayedId: undefined,
        projects: prevProjectList.projects.filter(
          (project) => project.id !== prevProjectList.currentProjectDisplayedId
        ),
        tasks: prevProjectList.tasks.filter(
          (task) => task.projectId !== prevProjectList.currentProjectDisplayedId
        ),
      };
    });
  }

  function handleAddProject() {
    setProjectList((prevProjectList) => {
      return { ...prevProjectList, currentProjectDisplayedId: null };
    });
  }

  function handleCancelAddProject() {
    setProjectList((prevProjectList) => {
      return { ...prevProjectList, currentProjectDisplayedId: undefined };
    });
  }

  function handleSaveProject(projectData) {
    const newProject = { ...projectData, id: v4() };
    setProjectList((prevProjectList) => {
      return {
        ...prevProjectList,
        currentProjectDisplayedId: undefined,
        projects: [...prevProjectList.projects, newProject],
      };
    });
  }

  const selectedProject = projectList.projects.find(
    (project) => project.id === projectList.currentProjectDisplayedId
  );
  const filteredTasks = projectList.tasks.filter(
    (task) => task.projectId === projectList.currentProjectDisplayedId
  );

  let mainContent = (
    <SelectedProject
      project={selectedProject}
      tasks={filteredTasks}
      onDelete={handleDeleteProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
    />
  );

  if (projectList.currentProjectDisplayedId === null) {
    mainContent = (
      <NewProject
        onSave={handleSaveProject}
        onCancel={handleCancelAddProject}
      />
    );
  } else if (projectList.currentProjectDisplayedId === undefined) {
    mainContent = <NoProjectSelected onCreateProject={handleAddProject} />;
  }

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectsSidebar
        onAddProject={handleAddProject}
        projects={projectList.projects}
        onProjectSelected={handleSelectProject}
        selectedProjectId={projectList.currentProjectDisplayedId}
      />
      {mainContent}
    </main>
  );
}

export default App;