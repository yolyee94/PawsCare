using UnityEngine;
using Photon.Pun;
using System.Collections.Generic;

public class DiceGameManager :NetworkBehaviour
{
    public static DiceGameManager Instance;

    public enum GameState
    {
        WaitingForPlayers,
        PlacingBets,
        RollingDice,
        CalculatingResults,
        GameOver
    }

    public GameState currentState;
    public List<Player> players = new List<Player>();
    public Player banker;
    
    [System.Serializable]
    public class Player
    {
        public string playerName;
        public int playerID;
        public float balance;
        public Dictionary<SymbolType, float> currentBets = new Dictionary<SymbolType, float>();
    }

    public enum SymbolType
    {
        Flag,
        Crown,
        Diamond,
        Heart,
        Spade,
        Club
    }

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        currentState = GameState.WaitingForPlayers;
        if (PhotonNetwork.IsMasterClient)
        {
            banker = new Player
            {
                playerName = PhotonNetwork.NickName,
                playerID = PhotonNetwork.LocalPlayer.ActorNumber,
                balance = 1000f
            };
        }
    }

    public void StartGame()
    {
        if (PhotonNetwork.IsMasterClient)
        {
            photonView.RPC("RPC_StartGame", RpcTarget.All);
        }
    }

    [PunRPC]
    private void RPC_StartGame()
    {
        currentState = GameState.PlacingBets;
        // Notify all players that betting phase has started
    }

    public void PlaceBet(int playerID, SymbolType symbol, float amount)
    {
        if (currentState != GameState.PlacingBets) return;

        photonView.RPC("RPC_PlaceBet", RpcTarget.All, playerID, symbol, amount);
    }

    [PunRPC]
    private void RPC_PlaceBet(int playerID, SymbolType symbol, float amount)
    {
        var player = players.Find(p => p.playerID == playerID);
        if (player != null && player.balance >= amount)
        {
            if (player.currentBets.ContainsKey(symbol))
            {
                player.currentBets[symbol] += amount;
            }
            else
            {
                player.currentBets.Add(symbol, amount);
            }
            player.balance -= amount;
        }
    }
} 