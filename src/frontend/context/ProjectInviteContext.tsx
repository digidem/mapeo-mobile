import * as React from "react";

export interface ProjectInvite {
  project: {
    id: string;
    name: string;
  };
  role: string;
}

const ProjectInviteContext = React.createContext<{
  invite?: ProjectInvite;
  removeInvite: (inviteId: string) => void;
  addInvite: () => void;
}>({ removeInvite: () => null, addInvite: () => null });

export const ProjectInviteProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [invites, setInvites] = React.useState<ProjectInvite[]>([]);

  // TODO: Need to integrate backend/interactions that add invite

  // TODO: Need to incorporate disabling based on current route (needs coordination with useProjectInviteListener)

  const removeInvite = (projectId: string) =>
    setInvites(previous =>
      previous.filter(invite => invite.project.id !== projectId)
    );

  const addInvite = React.useCallback(() => {
    setInvites([
      {
        project: { id: "test-id", name: "DD Project" },
        role: "Project Participant",
      },
    ]);
  }, []);

  return (
    <ProjectInviteContext.Provider
      value={{
        invite: invites[0],
        removeInvite,
        addInvite,
      }}
    >
      {children}
    </ProjectInviteContext.Provider>
  );
};

export default ProjectInviteContext;
