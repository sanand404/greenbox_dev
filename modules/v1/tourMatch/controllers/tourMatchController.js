import TourPoolModel from "../../tourPool/models/tourPoolModel";
import TourMatchModel from "../models/tourMatchModel";
import _ from "lodash";
import logger from "../../../../lib/logger";

class TourMatchController {
  /** Group the team pool wise and generate the combination */

  generateTeamCombination = (poolName, teams) => {
    //  return new Promise((resolve, reject) => {
    console.log(
      "-----------PoolName ",
      poolName,
      "Teams ",
      JSON.stringify(teams)
    );

    if (teams.length % 2 !== 0) {
      teams.push({ teamName: "BYE", poolName: poolName });
    }

    const pairs = _.chunk(teams, 2);
    const size = teams.length;
    const teamArr = new Array((size * (size - 1)) / 2);

    for (let i = 0; i < size / 2; i++) {
      teamArr[i] = new Array(2);
    }

    for (let i = 0; i < pairs.length; i++) {
      let j = 0;
      pairs[i].forEach(team => {
        teamArr[i][j++] = team;
      });
    }

    /** Teams are */
    console.log("-------_TEAMS--------------");
    // for (let i = 0; i < pairs.length; i++) {
    //   console.log(teamArr[i][0], " ", teamArr[i][1]);
    // }

    const matchTeam = [];
    for (let i = 0; i < size / 2; i++) {
      console.log("=====", teamArr[i][0].teamName, teamArr[i][1].teamName);
      matchTeam.push({
        teamA: teamArr[i][0].teamName,
        teamB: teamArr[i][1].teamName,
        poolName: poolName
      });
    }

    let tempTeam = teamArr[0][1];
    let tempTeam2;
    for (let kk = 1; kk < size - 1; kk++) {
      for (let i = 1; i < size; i++) {
        if (i < size / 2) {
          tempTeam2 = teamArr[i][1];
          teamArr[i][1] = tempTeam;
          tempTeam = tempTeam2;
        } else if (size - i - 1 > 0) {
          tempTeam2 = teamArr[size - i - 1][0];
          teamArr[size - i - 1][0] = tempTeam;
          tempTeam = tempTeam2;
        } else {
          teamArr[0][1] = tempTeam;
        }
      }
      for (let i = 0; i < size / 2; i++) {
        console.log(teamArr[i][0].teamName, teamArr[i][1].teamName);
        matchTeam.push({
          teamA: teamArr[i][0].teamName,
          teamB: teamArr[i][1].teamName,
          poolName: poolName
        });
      }
    }
    return matchTeam;
    // });
  };

  /** Geneate the temporary tournament match */

  create = async (req, res) => {
    const parameters = {
      TournamentId: req.body.TournamentId,
      poolGender: req.body.poolGender
    };

    const createMatchResponse = { success: [], failure: [] };
    let tourPoolResult;
    try {
      tourPoolResult = await TourPoolModel.getTourPoolTeams(parameters);
    } catch (error) {
      logger.error("Error for tourPoolResult in tourMatchController ", error);
      return res.status(400).send({ success: false, message: error });
    }
    parameters.UserId = req.user[0].idUser;
    parameters.matchType = req.body.matchType;

    if (
      !tourPoolResult ||
      (tourPoolResult && tourPoolResult.result[0].length === 0)
    ) {
      return res.send({ success: true, message: "No team found " });
    } else {
      const result = _.groupBy(tourPoolResult.result[0], team => team.poolName);

      /** Collection of teams according to pool */

      const teamPairResult = _.map(result, (values, keys) => {
        return { keys: keys, values: values };
      });

      for (const teamMap of teamPairResult) {
        /** For RoundRobin cobination */

        const teamCombinationResult = this.generateTeamCombination(
          teamMap.keys,
          teamMap.values
        );

        /** To generate the match */

        for (const teamPair of teamCombinationResult) {
          let createTempMatchResult;
          try {
            createTempMatchResult = await TourMatchModel.createTempMatch(
              parameters,
              teamPair
            );
          } catch (error) {
            logger.error(
              "Error for createTempMatchResult in tourMatchController  ",
              error
            );
            return res.status(400).send({ success: false, message: error });
          }
          if (!createTempMatchResult) {
            createMatchResponse.failure.push({
              success: false,
              message: `Error for ${teamPair.teamA} - ${
                teamPair.teamB
              } of Pool ${teamPair.poolName}`
            });
          } else {
            createMatchResponse.success.push({
              success: true,
              message: `Create match between ${teamPair.teamA} - ${
                teamPair.teamB
              } of Pool ${teamPair.poolName}`
            });
          }
        }
      }

      /** Sending the final response */

      return res
        .status(200)
        .send({ success: true, message: createMatchResponse });
    }
  };

  /** Generate tournament match */

  createTourMatch = async (req, res) => {
    let getTempMatchResult;
    try {
      const parameters = {
        TournamentId: req.body.tournamentId,
        gender: req.body.gender,
        matchType: req.body.matchType
      };
      getTempMatchResult = await TourMatchModel.getTempMatch(parameters);
    } catch (error) {
      logger.error("Error in createTourMatch ", error);
      return res.status(400).send({ success: false, message: error });
    }
    const result = _.groupBy(
      getTempMatchResult.result,
      tempMatch => tempMatch.poolName
    );

    /** Collection of teams according to pool */

    const teamPairResult = _.map(result, (values, keys) => {
      return { keys, values };
    });

    const poolList = [];
    for (let i = 0; i < teamPairResult.length; i++) {
      poolList.push(teamPairResult[i].keys);
    }
    console.log("---------_Result keys", poolList);

    console.log("GetTempMatchResult ", JSON.stringify(teamPairResult));
    console.log("-------------- ", getTempMatchResult.result.length);
    res.status(200).send({ success: true, data: teamPairResult });
  };
}

export default new TourMatchController();
