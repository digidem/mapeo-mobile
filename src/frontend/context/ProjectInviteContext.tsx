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
}>({ removeInvite: () => null });

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

  return (
    <ProjectInviteContext.Provider
      value={{
        invite: invites[0],
        removeInvite,
      }}
    >
      {children}
    </ProjectInviteContext.Provider>
  );
};

export default ProjectInviteContext;
