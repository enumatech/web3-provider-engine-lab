# curl -sI https://nixos.org/channels/nixpkgs-unstable/nixexprs.tar.xz | awk '/Location:/ {print $2}'
with import (
builtins.fetchTarball "https://d3g5gsiof5omrk.cloudfront.net/nixpkgs/nixpkgs-18.09pre143801.5ac6ab091a4/nixexprs.tar.xz"
) {};

mkShell rec {
  buildInputs = [
    coreutils direnv
    nodejs-8_x nodePackages_8_x.pnpm
    overmind
    go-ethereum
  ];
}
