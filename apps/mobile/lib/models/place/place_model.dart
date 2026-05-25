class PlaceModel {
  final String nome;
  final int nivelMovimento;
  final String categoria;
  final double avaliacao;
  final String nivelPrecoMedio;
  final String bio;
  final String endereco;
  final int qtdAvaliacoes;
  final List<double> distribuicao;

  PlaceModel({
    required this.nome,
    required this.nivelMovimento,
    required this.categoria,
    required this.avaliacao,
    required this.nivelPrecoMedio,
    required this.bio,
    required this.endereco,
    required this.distribuicao,
    required this.qtdAvaliacoes,
  });
}
