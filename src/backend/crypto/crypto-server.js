const { CryptoManager } = require("./CryptoManager");

/**
 *
 * @param {string} projectKey
 * @param {number} port
 */
export function createCrytoServer(projectKey, port) {
  /** @type {import('fastify').FastifyInstance} */
  const fastify = require("fastify")({
    logger: true,
  });

  const cryptoManager = new CryptoManager(getDeviceId());

  fastify.get("/joinReq", (req, res) => {
    return cryptoManager.createReqToJoinProject();
  });

  const inviteSchema = {
    schema: {
      body: {
        type: "object",
        properties: {
          joinReqAsString: { type: "string" },
        },
      },
    },
  };

  fastify.get("/invite", inviteSchema, (req, res) => {
    const request = JSON.parse(req.body);
    return cryptoManager.createInvite(request.joinReqAsString, projectKey);
  });

  const acceptInviteSchema = {
    schema: {
      body: {
        type: "object",
        properties: {
          inviteAsString: { type: "string" },
        },
      },
    },
  };

  fastify.get("/acceptInvite", acceptInviteSchema, (req, res) => {
    /**@type {string} */
    const invite = JSON.parse(req.body).inviteAsString;

    return cryptoManager.acceptProjectInvite(invite);
  });

  fastify.listen(port);
}
